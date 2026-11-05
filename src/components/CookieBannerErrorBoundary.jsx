import { Component } from "react";
class CookieBannerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn(
      "CookieBanner error boundary caught an error:",
      error,
      errorInfo,
    );
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
export { CookieBannerErrorBoundary as default };
