from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
import spacy
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
import redis
import psycopg2
import json
import random
import re
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app, resources={r"/*": {"origins": "*"}})

# Redis configuration from environment variables
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = os.getenv('REDIS_PORT', 6379)

# Connect to Redis for caching
redis_cache = redis.StrictRedis(host=redis_host, port=redis_port, db=0, decode_responses=True)
redis_cache.flushall()  # Redis reset

# Set up NLP
nlp = spacy.load("en_core_web_sm")

# PostgreSQL configuration from environment variables
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'visitor_classifier')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'Password')

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return conn

@app.route('/classify', methods=['POST'])
def classify():
    try:
        data = request.get_json()  # Get data as JSON
        url = data.get('url')  # Extract URL from the body

        if not url:
            return jsonify({"error": "No URL provided"}), 400

        # Ensure the URL starts with "http"
        if not url.startswith("http"):
            url = "http://" + url

        # Check Redis Cache
        cached_data = redis_cache.get(url)
        if cached_data:
            return jsonify({"questions": json.loads(cached_data)})

        # Scrape the URL content
        content = scrape_content(url)
        if not content:
            return jsonify({"error": "Failed to retrieve content from URL"}), 400

        # Generate Questions
        questions = generate_questions(content, from_url=True)

        # Cache and store questions
        store_questions_in_db(url, questions)
        redis_cache.set(url, json.dumps(questions))

        return jsonify({"questions": questions})

    except redis.exceptions.RedisError as e:
        print(f"Redis error: {e}")
        return jsonify({"error": "Cache service failure"}), 500
    except Exception as e:
        print(f"Error in classify endpoint: {e}")
        return jsonify({"error": str(e)}), 500

def scrape_content(url):
    try:
        if not url.startswith("http"):
            url = "http://" + url
        
        # Add a User-Agent header to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        # Use headers in the GET request
        response = requests.get(url, headers=headers, timeout=5)

        if response.status_code != 200:
            print(f"Failed to fetch content from {url} with status code: {response.status_code}")
            return None
        
        soup = BeautifulSoup(response.content, "html.parser")
        paragraphs = [p.get_text() for p in soup.find_all("p")]
        return " ".join(paragraphs)
    except requests.exceptions.Timeout:
        print(f"Request to {url} timed out.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None
    except Exception as e:
        print(f"Error scraping content: {e}")
        return None

def generate_questions(content, from_url=True):
    # Process content with SpaCy NLP
    doc = nlp(content)
    sentences = [sent.text.strip() for sent in doc.sents if len(sent.text.strip()) > 5]
    entities = [ent.text.strip() for ent in doc.ents if ent.label_ in {"PERSON", "ORG", "GPE", "PRODUCT", "EVENT"}]

    # Organize topics into categories: entities vs. sentences
    topics = list(set(entities + sentences[:10]))  # Deduplicate topics

    # Intelligent fallback if less than 3 topics are found
    if len(topics) < 3:
        fallback_topic = categorize_fallback(content)
        topics += fallback_topic  # Add more contextual fallback topics

    # Shuffle topics to ensure randomness
    random.shuffle(topics)

    # Define question templates with dynamic options based on the content
    question_templates = [
        lambda t: {
            "questionId": random.randint(1000, 9999),  # Add unique question ID
            "question": f"What is your opinion on '{t}'?",
            "options": generate_dynamic_options(t, "opinion")
        },
        lambda t: {
            "questionId": random.randint(1000, 9999),  # Add unique question ID
            "question": f"Would you like to learn more about '{t}'?",
            "options": ["Yes", "No"]
        },
        lambda t: {
            "questionId": random.randint(1000, 9999),  # Add unique question ID
            "question": f"How important is '{t}' to you?",
            "options": generate_dynamic_options(t, "importance")
        },
        lambda t: {
            "questionId": random.randint(1000, 9999),  # Add unique question ID
            "question": f"Where do you think '{t}' fits best?",
            "options": generate_dynamic_options(t, "fit")
        },
        lambda t: {
            "questionId": random.randint(1000, 9999),  # Add unique question ID
            "question": f"On a scale of 1-5, how would you rate your interest in '{t}'?",
            "options": generate_dynamic_options(t, "interest")
        },
        lambda t: {
            "questionId": random.randint(1000, 9999),  # Add unique question ID
            "question": f"Do you agree with the statement: '{t}' is revolutionary?",
            "options": generate_dynamic_options(t, "agreement")
        },
        lambda t: {
            "questionId": random.randint(1000, 9999),  # Add unique question ID
            "question": f"What challenges might you foresee with '{t}'?",
            "options": generate_dynamic_options(t, "challenges")
        },
    ]

    # Generate questions from URL content (if from_url is True)
    url_based_questions = []
    if from_url:
        # Ensure all questions come from the URL content
        for topic in topics:
            template = random.choice(question_templates)
            question_data = template(topic)
            if filter_questions(question_data):
                url_based_questions.append(question_data)

    # Combine URL-based questions
    questions = url_based_questions

    # Fallback question if none are generated
    if not questions:
        questions.append({
            "questionId": random.randint(1000, 9999),  # Add unique question ID
            "question": "What is your overall impression of this content?",
            "options": ["Interesting", "Boring", "Confusing"]
        })

    return questions

def filter_questions(question_data):
    """
    Validates a question to ensure it makes sense and avoids invalid formatting.
    """
    question = question_data.get("question", "")
    options = question_data.get("options", [])

    # Basic validations
    if not question or not options:
        return False  # Invalid question or no options
    if len(options) < 2:
        return False  # Too few options
    if question.endswith('.') or not question.endswith('?'):
        return False  # Fix improper punctuation

    # Remove nonsensical fragments
    if "Terms and Conditions" in question or "Privacy Policy" in question:
        return False
    if any(phrase in question for phrase in ["CA Notice", "see our"]):
        return False

    return True

def generate_dynamic_options(topic, question_type):
    """
    Generates dynamic multiple-choice options based on the topic and question type.
    The question type helps tailor the options more specifically to the context.
    """
    # Example of generating dynamic options based on the topic
    if question_type == "opinion":
        return ["Positive", "Negative", "Neutral"]
    elif question_type == "importance":
        return ["Not at all", "Somewhat", "Very important"]
    elif question_type == "fit":
        return ["Technology", "Science", "Business", "Other"]
    elif question_type == "interest":
        return ["1", "2", "3", "4", "5"]
    elif question_type == "agreement":
        return ["Agree", "Disagree", "Not Sure"]
    elif question_type == "challenges":
        # Challenges based on the type of topic (e.g., technology, product, etc.)
        if "technology" in topic.lower():
            return ["High cost", "Implementation difficulties", "Resistance to change"]
        elif "event" in topic.lower():
            return ["Unexpected consequences", "Lack of preparation", "Public backlash"]
        elif "product" in topic.lower():
            return ["Supply chain issues", "Quality control", "Market competition"]
        else:
            return ["Time constraints", "Resource limitations", "Knowledge gaps"]
    else:
        return ["Agree", "Disagree", "Not Sure"]  # Default fallback options

def categorize_fallback(content):
    """
    Provides fallback categories based on the type of content.
    """
    if "event" in content.lower():
        return ["key facts about this event", "impacts of this event on the industry"]
    elif "product" in content.lower():
        return ["product benefits", "product challenges"]
    elif "technology" in content.lower():
        return ["future trends in technology", "challenges in adopting new technologies"]
    else:
        return ["general knowledge", "specific details"]

def store_questions_in_db(url, questions):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(''' 
            CREATE TABLE IF NOT EXISTS questions (
                id SERIAL PRIMARY KEY,
                url TEXT NOT NULL,
                question TEXT NOT NULL,
                option1 TEXT,
                option2 TEXT,
                option3 TEXT,
                option4 TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        for q in questions:
            cursor.execute('''
                INSERT INTO questions (url, question, option1, option2, option3, option4)
                VALUES (%s, %s, %s, %s, %s, %s)
            ''', (
                url,
                q['question'],
                q['options'][0],
                q['options'][1],
                q['options'][2] if len(q['options']) > 2 else None,
                q['options'][3] if len(q['options']) > 3 else None
            ))

        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Error storing questions in database: {e}")

if __name__ == '__main__':
    app.run()
