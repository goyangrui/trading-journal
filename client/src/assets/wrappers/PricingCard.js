import styled from "styled-components";

const PricingCard = styled.div`
  /* Pricing card styles */
  .pricing-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 800px;
    margin: 0 auto;
    margin-bottom: 5rem;
    background: var(--gray-200);
    border-radius: var(--borderRadius-1);
    border: var(--border-1);
    box-shadow: var(--shadow-4);
  }

  /* Pricing card content */
  .pricing-card div {
    text-align: center;
    padding: 1rem;
  }

  .pricing-card div:not(:last-child) {
    border-bottom: var(--border-1);
    margin: 0 1rem;
  }

  /* button styles */
  .btn:hover {
    color: var(--white);
    background: var(--primary-600);
    border: 2px solid var(--primary-600);
  }

  button:disabled {
    cursor: not-allowed;
    pointer-events: all !important;
  }
`;

export default PricingCard;
