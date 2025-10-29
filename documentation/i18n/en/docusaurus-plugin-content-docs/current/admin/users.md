---
title: User Management & Roles
sidebar_position: 2
---

# User Management

In the Admin Panel, the **`User`** section provides all functions for managing administrators and user accounts.  
Here, you can create new users, assign roles, change passwords, and delete user accounts.

---

## Creating a User

1. Open the **`User`** section and click **`Create new`**.
2. Fill in the required fields: **`Username`**, **`Password`**, and **`Role`**.
   - If no roles exist yet, create them first under the **`Role`** section.
   - Assign the **`superuser`** role for full administrative access.
   - For users with limited permissions, choose an appropriate restricted role.
3. After saving, the new user can log in to the system.

---

:::info Password Policy

When creating a user, a password must be set.  
The system validates the password according to the following criteria:

- at least **8 characters**
- includes **uppercase and lowercase letters**
- contains at least **one digit**
- contains at least **one special character**

After the first login, users should change their password.  
The **`Change Password`** function can be found in the upper-right corner of the Admin Panel and appears when hovering over the username.  
The validation checks password strength and requires confirmation of the new password.

:::

---

## Roles & Superuser

Roles control user permissions and can be managed under the **`Role`** section.  
The **`superuser`** role has extended privileges, including:

- Access to system logs
- Management of other users
- Management of roles and permissions

---

:::info For Developers

For development environments, a seed script is available at  
`/backend/admin/prisma/seed.js`  
to create an initial superuser.

Run the script in the `backend/admin` directory with:

```bash
npm run dev:prisma-seed
```

Before running, adjust the following environment variables in your `.env` file:

- `DEFAULT_ADMIN_USERNAME`

- `DEFAULT_ADMIN_PASSWORD`

These define the initial username and password for the superuser account.

:::

## Visibility & Data Protection

- Passwords are not displayed in list or detail views.

- In log views, password changes are masked to protect sensitive data.

## Security Recommendations

- Use strong, unique passwords and share them only through secure communication channels.

- Create only as many superusers as absolutely necessary to minimize security risks.
