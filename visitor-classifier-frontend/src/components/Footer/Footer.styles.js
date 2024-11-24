import styled from 'styled-components';

export const StyledFooter = styled.footer`
  background: #1f1f1f;
  color: #d3d3d3;
  padding: 1.5rem 1rem;
  margin-top: 4%;
  text-align: center;
  font-size: 1.4rem;
  line-height: 1.6;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.2);
  a {
    color: #4caf50;
    text-decoration: none;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: color 0.3s ease;
  }
  a:hover {
    color: #81c784;
  }
  strong {
    color: white;
  }
`;

export const IconContainer = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 1.5rem;
  vertical-align: middle;
  position: relative;

  &.adjustedtop {
    top: 0.15rem;
  }

  &.adjusteddown {
    bottom: 0.15rem;
  }
`;
