// export default {
//     extends: ["@commitlint/config-conventional"],
//     rules: {
//         "type-enum": [
//             2,
//             "always",
//             [
//                 "feat", // A new feature
//                 "fix", // A bug fix
//                 "docs", // Documentation only changes
//                 "style", // Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
//                 "refactor", // A code change that neither fixes a bug nor adds a feature
//                 "perf", // A code change that improves performance
//                 "test", // Adding missing tests or correcting existing tests
//                 "build", // Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
//                 "ci", // Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
//                 "chore", // Other changes that don't modify src or test files
//                 "revert", // Revert to a commit
//             ],
//         ],
//         "scope-enum": [
//             2,
//             "always",
//             [
//                 "app", // Example scope: app
//                 "module", // Example scope: module
//                 "service", // Example scope: service
//                 "controller", // Example scope: controller
//                 "repo", // Example scope: repository
//                 "config", // Example scope: config
//                 "test", // Example scope: test
//                 // Add other relevant scopes as needed
//             ],
//         ],
//         "subject-case": [2, "always", ["sentence-case"]],
//         "header-max-length": [2, "always", 72], // Optional: Limit header length
//     },
// }
