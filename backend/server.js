const express = require("express")
const fs = require("fs").promises
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())

const ATTRIBUTES_FILE = "./attributes.json"
const CONTENT_TYPES_FILE = "./contentTypes.json"

// Hent alle attributter
app.get("/api/attributes", async (req, res) => {
  try {
    const data = await fs.readFile(ATTRIBUTES_FILE, "utf8")
    res.json(JSON.parse(data).attributes)
  } catch (err) {
    res.status(500).json({ error: "Kunne ikke hente attributter" })
  }
})

// Hent alle innholdstyper
app.get("/api/content-types", async (req, res) => {
  try {
    const data = await fs.readFile(CONTENT_TYPES_FILE, "utf8")
    res.json(JSON.parse(data).contentTypes)
  } catch (err) {
    res.status(500).json({ error: "Kunne ikke hente innholdstyper" })
  }
})

// Legg til ny innholdstype (oppdaterer contentTypes.json)
app.post("/api/content-types", async (req, res) => {
  try {
    const data = await fs.readFile(CONTENT_TYPES_FILE, "utf8")
    const contentTypes = JSON.parse(data).contentTypes
    const newType = {
      ...req.body,
      specificAttributes: req.body.specificAttributes || [],
    }
    contentTypes.push(newType)
    await fs.writeFile(
      CONTENT_TYPES_FILE,
      JSON.stringify({ contentTypes }, null, 2)
    )
    res.json(newType)
  } catch (err) {
    res.status(500).json({ error: "Kunne ikke lagre innholdstype" })
  }
})

app.listen(3000, () => console.log("Server kjører på port 3000"))
