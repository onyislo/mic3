# Database Schema Documentation

## Important Note on Naming Conventions

Supabase database tables and columns are **case-sensitive** and **preserve spaces**. This project uses a specific naming convention that must be followed when interacting with the database.

## Table Names

All table names use **Pascal Case with Underscores** for multi-word table names:

- `Courses`
- `Course_Content`
- `Course_Progress`
- `Payments`
- `Badges`
- `User_Badges`

## Column Naming Conventions

### Courses Table

| Column Name     | Type                    | Notes                                       |
|----------------|-------------------------|---------------------------------------------|
| id             | UUID                    | Primary Key, default uuid_generate_v4()      |
| Course Title   | TEXT                    | Note the space and capitalization            |
| Description    | TEXT                    | Capitalized                                  |
| Instructor     | TEXT                    | Capitalized                                  |
| Price          | NUMERIC(10,2)           | Capitalized                                  |
| duration       | TEXT                    | Lowercase                                    |
| level          | TEXT                    | Lowercase, enum: beginner, intermediate, advanced |
| image_url      | TEXT                    | Lowercase with underscore                    |
| category       | TEXT                    | Lowercase                                    |
| status         | TEXT                    | Lowercase, enum: active, draft, archived      |
| slug           | TEXT                    | Lowercase                                    |
| created_at     | TIMESTAMP WITH TIME ZONE| Lowercase with underscore                    |
| updated_at     | TIMESTAMP WITH TIME ZONE| Lowercase with underscore                    |

### Course_Content Table

| Column Name    | Type                    | Notes                                       |
|---------------|-------------------------|---------------------------------------------|
| id            | UUID                    | Primary Key, default uuid_generate_v4()      |
| course_id     | UUID                    | Foreign Key to Courses(id)                  |
| Title         | TEXT                    | Capitalized                                  |
| Content       | TEXT                    | Capitalized                                  |
| Module        | INTEGER                 | Capitalized                                  |
| Order         | INTEGER                 | Capitalized                                  |
| content_type  | TEXT                    | Lowercase with underscore                    |
| media_url     | TEXT                    | Lowercase with underscore                    |
| duration      | INTEGER                 | Lowercase                                    |
| created_at    | TIMESTAMP WITH TIME ZONE| Lowercase with underscore                    |
| updated_at    | TIMESTAMP WITH TIME ZONE| Lowercase with underscore                    |

### Course_Progress Table

| Column Name      | Type                    | Notes                                     |
|-----------------|-------------------------|-------------------------------------------|
| id              | UUID                    | Primary Key, default uuid_generate_v4()    |
| user_id         | UUID                    | NOT NULL                                   |
| course_id       | UUID                    | Foreign Key to Courses(id)                |
| progress        | NUMERIC                 | Default 0                                  |
| completed       | BOOLEAN                 | Default false                              |
| last_accessed_at| TIMESTAMP WITH TIME ZONE| Lowercase with underscore                  |
| created_at      | TIMESTAMP WITH TIME ZONE| Lowercase with underscore                  |
| updated_at      | TIMESTAMP WITH TIME ZONE| Lowercase with underscore                  |

### Payments Table

| Column Name    | Type                    | Notes                                       |
|---------------|-------------------------|---------------------------------------------|
| id            | UUID                    | Primary Key, default uuid_generate_v4()      |
| user_id       | UUID                    | NOT NULL                                     |
| course_id     | UUID                    | Foreign Key to Courses(id)                  |
| amount        | NUMERIC(10,2)           | NOT NULL                                     |
| status        | TEXT                    | Default 'pending', enum: pending, completed, failed, refunded |
| payment_method| TEXT                    | Lowercase with underscore                    |
| transaction_id| TEXT                    | Lowercase with underscore                    |
| created_at    | TIMESTAMP WITH TIME ZONE| Lowercase with underscore                    |
| updated_at    | TIMESTAMP WITH TIME ZONE| Lowercase with underscore                    |

## Best Practices

1. Always use the exact column names as defined in this document when creating queries
2. When defining TypeScript interfaces, match the exact column names:

```typescript
interface Course {
  id: string;
  "Course Title": string;
  "Description": string | null;
  "Instructor": string | null;
  price: number;
  // etc...
}
```

3. When inserting or updating data, use the exact column names:

```typescript
const { data, error } = await supabaseClient
  .from("Courses")
  .insert([{
    "Course Title": title,
    "Description": description,
    "Instructor": instructor,
    // etc...
  }]);
```
