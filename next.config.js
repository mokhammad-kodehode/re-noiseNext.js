require("dotenv").config();

const nextConfig = {
  env: {
    DATABASE_URI:
      process.env.DATABASE_URI ||
      "mongodb+srv://mohammaddjabrail:cJkZFlE7DwP4uJiZ@cluster0.7gbph3o.mongodb.net/?retryWrites=true&w=majority",
  },
};

module.exports = nextConfig;
