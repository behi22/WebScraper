import React from 'react';
import { StyledFooter, IconContainer } from './Footer.styles';
import {
  GithubOutlined,
  LinkedinOutlined,
  CopyrightOutlined,
} from '@ant-design/icons';

const Footer = () => (
  <StyledFooter>
    <div>
      <p>
        <strong>About this site:</strong> This platform allows users to fetch
        and answer questions dynamically based on the URL provided. Developed
        with care and precision for an engaging user experience.
      </p>
    </div>
    <div>
      <p>
        <strong>Developer Information:</strong> Created by Behbod Babai. Check
        out my work on{' '}
        <a
          href="https://github.com/behi22"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconContainer className="adjustedtop">
            <GithubOutlined />
            GitHub
          </IconContainer>
        </a>{' '}
        or connect with me on{' '}
        <a
          href="https://www.linkedin.com/in/behbod-babai/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconContainer className="adjustedtop">
            <LinkedinOutlined />
            LinkedIn
          </IconContainer>
        </a>
        .
      </p>
    </div>
    <div>
      <p>
        <IconContainer className="adjusteddown">
          <CopyrightOutlined />
        </IconContainer>{' '}
        {new Date().getFullYear()} Behbod Babai. All rights reserved.
      </p>
    </div>
  </StyledFooter>
);

export default Footer;
