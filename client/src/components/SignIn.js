import { useEffect } from "react";

export const SignIn = () => {
  // const cognitoUrl = 'https://f1-telemetry-user.auth.ap-southeast-2.amazoncognito.com/login?response_type=code&client_id=1l3tetgbv55on65v5esrqtu9hu&redirect_uri=https://f1telemetryviewer.com/sessions';
  useEffect(() => {
    return window.location.replace("https://f1-telemetry-user.auth.ap-southeast-2.amazoncognito.com/login?response_type=code&client_id=1l3tetgbv55on65v5esrqtu9hu&redirect_uri=https://f1telemetryviewer.com/sessions")
  }, []);

  return null;
};