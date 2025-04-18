import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error("Component Error:", error);
    console.error("Error Stack:", errorInfo.componentStack);
    
    // Update state with error details
    this.setState({ error, errorInfo });
    
    // You could also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  }

  render() {
    const { fallback } = this.props;
    
    // If there is an error, render the fallback UI
    if (this.state.hasError) {
      // If a custom fallback was provided, use it
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(this.state.error, this.resetError)
          : fallback;
      }
      
      // Otherwise use our default fallback UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <h2>Something went wrong</h2>
            <p>We encountered an error while rendering this component.</p>
            
            {this.state.error && (
              <div className="error-details">
                <p className="error-message">{this.state.error.toString()}</p>
                <details>
                  <summary>View component stack</summary>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                </details>
              </div>
            )}
            
            <div className="error-actions">
              <button onClick={this.resetError} className="error-retry-button">
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="error-reload-button"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Otherwise, render children normally
    return this.props.children;
  }
}

// Default component styling
const styles = `
.error-boundary-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 300px;
}

.error-boundary-card {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 600px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error-boundary-card h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ef4444;
}

.error-details {
  margin: 1rem 0;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: auto;
}

.error-message {
  font-weight: 500;
  color: #ef4444;
  margin-bottom: 0.5rem;
}

details {
  margin-top: 0.5rem;
}

summary {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

pre {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: auto;
  font-size: 0.75rem;
  white-space: pre-wrap;
  color: rgba(255, 255, 255, 0.9);
}

.error-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.error-retry-button, .error-reload-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.error-retry-button {
  background-color: #4f46e5;
  color: white;
}

.error-reload-button {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.error-retry-button:hover {
  background-color: #4338ca;
}

.error-reload-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
}
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export { ErrorBoundary };

