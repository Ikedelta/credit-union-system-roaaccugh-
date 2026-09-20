# Backend Architecture Overview

The backend API is located in the `apps/server` directory. It is built using a modern Node.js and TypeScript stack.

## Tech Stack

- **Runtime & Language:** Node.js, TypeScript
- **Web Framework:** Express.js
- **Database ORM:** Prisma
- **Authentication & Storage:** Supabase (`@supabase/supabase-js`), JWT (`jsonwebtoken`), and `bcrypt`
- **File Uploads:** Multer
- **Email Delivery:** Nodemailer
- **Security & Utilities:** CORS, Helmet, Morgan, Cookie Parser
