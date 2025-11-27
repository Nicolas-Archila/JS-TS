SELECT 'CREATE DATABASE hospital_desk'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hospital_desk')\gexec

\connect hospital_desk
CREATE EXTENSION IF NOT EXISTS pgcrypto;