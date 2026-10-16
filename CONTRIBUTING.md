# Contributing to DocuMind-RAG

Thank you for your interest in contributing to **DocuMind-RAG**! We welcome contributions from the community to help improve document intelligence and retrieval-augmented generation.

---

## 🛠️ How to Contribute

### 1. Reporting Bugs
- Before submitting an issue, search the issue tracker to ensure it hasn't already been reported.
- If you find a bug, open a new issue using our **Bug Report** template. Include:
  - Clear steps to reproduce the issue.
  - Expected vs. actual behavior.
  - Environment details (Python version, OS, Ollama/Bedrock setup, etc.).

### 2. Suggesting Features & Enhancements
- Have an idea for improved retrieval, new document loaders, or UI additions?
- Open an issue using our **Feature Request** template and outline the problem, proposed solution, and alternative considerations.

### 3. Pull Request Guidelines

1. **Fork the Repository**:
   Fork `DocuMind-RAG` to your GitHub account and clone it locally:
   ```bash
   git clone https://github.com/Chaitanya1825/DocuMind-RAG.git
   cd DocuMind-RAG
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Install Dependencies in a Virtual Environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Make Your Changes**:
   - Write clean, documented, and PEP 8 compliant Python code.
   - For UI changes in `frontend/`, maintain dark-mode SaaS aesthetic standards, accessibility attributes, and responsive design.

5. **Run Tests**:
   - Ensure existing tests pass:
     ```bash
     pytest test_rag.py
     ```
   - Add new tests if introducing new retrieval or chunking functionality.

6. **Commit & Push**:
   ```bash
   git commit -m "feat(retrieval): add support for markdown documents"
   git push origin feature/your-feature-name
   ```

7. **Submit a Pull Request**:
   - Fill out the PR template with a summary of changes and reference any associated issues.

---

## 📜 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please be respectful, constructive, and collaborative.

---

## 📄 License

By contributing to DocuMind-RAG, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
