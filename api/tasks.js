import express from "express";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import z from "zod";
import helmet from "helmet";

const app = express();

// Helmet code
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://*.supabase.co", // Allows connections to your Supabase API
          "wss://*.supabase.co", // Allows Supabase Realtime WebSockets if used
        ],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://*.supabase.co"],
      },
    },
  }),
);

app.use(express.json());

// ZOD - For Data Validation
const taskIdSchema = z.object({ id: z.coerce.number().int().positive() });
const taskAddSchema = z.object({
  user_id: z.string().uuid(),
  title: z.string().min(1).max(100).trim(),
  description: z.string().max(1000).optional(),
  due_date: z.string().date().optional(),
});
const taskUpdateSchema = z.object({
  title: z.string().min(1).max(100).trim().optional(),
  description: z.string().max(1000).optional(),
  due_date: z.string().date().optional(),
  is_completed: z.boolean().optional(),
});

const withSupabase = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header found" });
  }

  // Create a request-specific client
  // If no token exists, it behaves as an 'anon' client
  const supabaseClient = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    },
  );

  // Attach it to res.locals so all routes can access it
  res.locals.supabase = supabaseClient;
  next();
};

// Apply it to all /api routes
app.use("/api", withSupabase);

// GET route to get task
app.get("/api/tasks", async (req, res) => {
  // Pull the pre-authorized client from locals
  const { supabase } = res.locals;

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_time", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});

// POST route to add a task
app.post("/api/tasks", async (req, res) => {
  const { supabase } = res.locals;
  // Data Validation
  const validation = taskAddSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors });
  }

  const { user_id, title, description, due_date } = validation.data;

  if (!user_id || !title) {
    return res.status(400).json({ error: "User ID and Title are required" });
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert([{ user_id, title, description, due_date }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: "Task added!", task: data[0] });
});

// DELETE route to remove a task
app.delete("/api/tasks", async (req, res) => {
  const { supabase } = res.locals;
  const validationID = taskIdSchema.safeParse(req.query);
  const { id } = validationID.data;

  const { error } = await supabase.from("tasks").delete().eq("id", id); // Matches the unique primary key of the task

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Task deleted successfully" });
});

// PATCH route to toggle completion status
app.patch("/api/tasks", async (req, res) => {
  const { supabase } = res.locals;
  const validationID = taskIdSchema.safeParse(req.query);
  const { id } = validationID.data;
  const validationData = taskUpdateSchema.safeParse(req.body);
  const { title, description, due_date, is_completed } = validationData.data;

  const { data, error } = await supabase
    .from("tasks")
    .update({ title, description, due_date, is_completed })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data[0]);
});

// For ES Modules ("type": "module"), use export default instead of module.exports
export default app;
