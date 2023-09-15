module.exports = {
  verbose: true, // Ensure this is not set to false
  clearMocks:true,
  preset:"ts-jest",
  setupFilesAfterEnv: ['./singleton.ts'],
  projects: [
    {
      displayName: "server",
      roots: ["."],
      testMatch: ["**/tests/**/*.test.ts"],
      transform: {
        "^.+\\.ts$": "ts-jest",
      },
    },
  ],
};
