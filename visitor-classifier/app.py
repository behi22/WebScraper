from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
import requests
import spacy
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
import redis
import psycopg2

app = Flask(__name__)

# Connect to Redis for caching
redis_cache = redis.StrictRedis(host='localhost', port=6379, db=0)

# Set up NLP
nlp = spacy.load("en_core_web_sm")

# PostgreSQL configuration
DB_HOST = 'localhost'
DB_NAME = 'visitor_classifier'
DB_USER = 'postgres'
DB_PASSWORD = '***REMOVED***'

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
    url = request.json.get('url')
    
    # Check Redis Cache
    cached_data = redis_cache.get(url)
    if cached_data:
        return jsonify({"questions": cached_data.decode("utf-8")})

    # Scrape the URL
    content = scrape_content(url)
    if not content:
        return jsonify({"error": "Unable to scrape content"}), 400

    # Generate Questions and Options
    questions = generate_questions(content)

    # Cache and store in PostgreSQL
    store_questions_in_db(url, questions)

    redis_cache.set(url, questions)
    return jsonify({"questions": questions})

def scrape_content(url):
    try:
        page = requests.get(url)
        soup = BeautifulSoup(page.content, "html.parser")
        paragraphs = [p.get_text() for p in soup.find_all("p")]
        return " ".join(paragraphs)
    except Exception as e:
        print(f"Error scraping content: {e}")
        return None

def generate_questions(content):
    doc = nlp(content)
    topics = [chunk.text for chunk in doc.noun_chunks if len(chunk.text) > 2]
    vectorizer = TfidfVectorizer(max_features=5)
    vectors = vectorizer.fit_transform(topics)
    
    # Cluster the topics to form categories
    kmeans = KMeans(n_clusters=3, random_state=0)
    labels = kmeans.fit_predict(vectors)
    
    # Generate questions based on topics
    questions = []
    for i in range(3):
        category = " ".join([topics[j] for j in range(len(topics)) if labels[j] == i])
        questions.append({
            "question": f"What best describes your interest in {category}?",
            "options": ["Beginner", "Intermediate", "Expert"]
        })
    return questions

def store_questions_in_db(url, questions):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create a table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id SERIAL PRIMARY KEY,
            url TEXT NOT NULL,
            question TEXT NOT NULL,
            option1 TEXT,
            option2 TEXT,
            option3 TEXT
        )
    ''')
    
    for q in questions:
        cursor.execute('''
            INSERT INTO questions (url, question, option1, option2, option3)
            VALUES (%s, %s, %s, %s, %s)
        ''', (url, q['question'], q['options'][0], q['options'][1], q['options'][2]))

    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    app.run(debug=True)
