# Repository guidance

- Follow the project brief: Next.js, TypeScript, Tailwind CSS, Firebase Authentication, Cloud Firestore, and Firebase Hosting.
- Keep user-owned documents under `/users/{uid}/...`; do not allow cross-user reads or writes.
- Never commit credentials, private keys, or real financial information. Use `.env.example` with empty placeholders.
- Do not deploy or apply destructive database changes without explicit human approval.
- Before each task, read this file, README.md, existing Issues, and the current branch code.
- Use a dedicated branch for each task. Preserve other contributors' branches.
- Add focused tests for new behavior and run typecheck, lint, tests, and build before reporting success.
- Describe implementation, changed files, test results, limitations, and review requests in the pull request.
