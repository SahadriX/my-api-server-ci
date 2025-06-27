# 🧪 Keploy API Testing & CI/CD Integration Project

This project demonstrates the use of **Keploy** for API testing using both the **Keploy CLI** and **Keploy Chrome Extension**. It includes OpenAPI schema generation, AI-based test generation, and CI/CD pipeline integration.

---

## ✅ Task 1: CLI-Based API Testing & CI/CD

### 🔹 OpenAPI Schema

- I created an OpenAPI schema for my Node.js Express project using manual annotations and tools like [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc).
- The schema defines all endpoints (`/hello`, `/echo`) with request/response structures.

> 📁 File: `openapi.yaml` (included in this repo)

---

### 🔹 AI-Powered API Testing

- Used `curl` commands to hit the API during a recording session with Keploy.
- Tests were generated automatically based on real traffic.
- Then replayed the tests with `keploy test` to validate behavior.

---

🔹 CI/CD Integration
I used GitHub Actions for CI/CD.

Added a Keploy testing stage that installs dependencies and runs tests via CLI.

---

Task 2: Chrome Extension API Testing [Mandatory]
🔹 Websites Tested Using Keploy Chrome Extension
Nike.com
🔗 Referenced using the Keploy Chrome Extension

---

🧪 Process Followed
Installed the Keploy Chrome Extension and pinned it to the toolbar.

Clicked "Start Recording" and browsed the site.

After interacting, clicked "Stop Recording".

Generated test cases and copied curl commands.

Replayed them using the CLI locally to validate.

![Screenshot 2025-06-27 210318](https://github.com/user-attachments/assets/20797e2c-82a9-4611-9ea6-82dd72b10c49)

---

📂 GitHub Repo & Submission
🔗 GitHub Repo: https://github.com/YourUsername/keploy-api-testing

📝 Contains:

OpenAPI schema
Keploy CLI test cases
Screenshots from CLI and extension
GitHub Actions CI/CD workflow file



 


