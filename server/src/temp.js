const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const testSchema = z.object({
  name: z.string(),
  age: z.number()
});

console.dir(
  zodToJsonSchema(testSchema),
  { depth: null }
);