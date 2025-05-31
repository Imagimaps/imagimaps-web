import { useRouteError } from '@modern-js/runtime/router';
import './error/styles.css';

export default function GlobalErrorBoundary() {
  const error = useRouteError();
  console.error('Global uncaught error:', error);

  return (
    <div className="error-container">
      <div className="error-content">
        <h1>Oops! Something went wrong</h1>
        <p className="error-description">
          Kaboom, we encountered an unexpected error.
        </p>
        <div className="error-details">
          {error instanceof Error ? (
            <>
              <p className="error-message">{error.message}</p>
              {error.stack && (
                <details className="error-stack">
                  <summary>Error details</summary>
                  <pre>{error.stack}</pre>
                </details>
              )}
            </>
          ) : (
            <p className="error-message">An unknown error occurred</p>
          )}
        </div>
        <button
          className="return-button"
          onClick={() => (window.location.href = '/')}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
