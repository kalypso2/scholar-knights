const appName: string = "scholarknights";

type Environment = "production" | "development" | "test";

declare const process: { env: { NODE_ENV: Environment } };

export function buildPath(route: string): string {
  if (process.env.NODE_ENV === "production") {
    return `http://${appName}.com/${route}`;
  } else {
    return `http://localhost:5000/${route}`;
  }
}
