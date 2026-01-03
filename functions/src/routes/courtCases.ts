import { Router } from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { authenticateToken, requireAdmin, AuthenticatedRequest } from "../middleware/auth";
import Busboy from "busboy";

const router = Router();
const db = admin.firestore();
const bucket = admin.storage().bucket();

// Interface for Court Case
interface CourtCase {
  id?: string;
  caseTitle: string;
  caseNumber: string;
  description?: string;
  dateFiled: string;
  status: string;
  courtName?: string;
  judgeName?: string;
  plaintiff?: string;
  defendant?: string;
  caseType?: string;
  priority: string;
  pdfFileUrl?: string;
  pdfFileName?: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

// GET all court cases with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = db.collection("courtCases");

    // Apply filters
    if (status && status !== "all") {
      query = query.where("status", "==", status);
    }

    // Apply sorting
    query = query.orderBy(sortBy as string, sortOrder as "asc" | "desc");

    // Get total count for pagination
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    // Apply pagination
    const snapshot = await query.offset(offset).limit(limitNum).get();

    const cases: CourtCase[] = [];
    snapshot.forEach((doc) => {
      cases.push({ id: doc.id, ...doc.data() } as CourtCase);
    });

    // Filter by search term if provided (client-side filtering for simplicity)
    let filteredCases = cases;
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredCases = cases.filter(
        (courtCase) =>
          courtCase.caseTitle.toLowerCase().includes(searchTerm) ||
          courtCase.caseNumber.toLowerCase().includes(searchTerm) ||
          (courtCase.description && courtCase.description.toLowerCase().includes(searchTerm))
      );
    }

    res.json({
      cases: filteredCases,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching court cases:", error);
    res.status(500).json({ error: "Failed to fetch court cases" });
  }
});

// GET single court case
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("courtCases").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Court case not found" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching court case:", error);
    res.status(500).json({ error: "Failed to fetch court case" });
  }
});

// POST create new court case with file upload
router.post("/", authenticateToken, requireAdmin, (req: AuthenticatedRequest, res) => {
  const busboy = Busboy({ headers: req.headers });
  const fields: any = {};
  let fileBuffer: Buffer | null = null;
  let fileName: string | null = null;
  let mimeType: string | null = null;

  busboy.on("field", (fieldname, val) => {
    fields[fieldname] = val;
  });

  busboy.on("file", (fieldname, file, info) => {
    if (fieldname === "pdfFile") {
      fileName = info.filename;
      mimeType = info.mimeType;
      
      if (mimeType !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF files are allowed" });
      }

      const chunks: Buffer[] = [];
      file.on("data", (chunk) => chunks.push(chunk));
      file.on("end", () => {
        fileBuffer = Buffer.concat(chunks);
      });
    }
  });

  busboy.on("finish", async () => {
    try {
      const {
        caseTitle,
        caseNumber,
        description,
        dateFiled,
        status = "Active",
        courtName,
        judgeName,
        plaintiff,
        defendant,
        caseType,
        priority = "Medium",
      } = fields;

      if (!caseTitle || !caseNumber || !dateFiled) {
        return res.status(400).json({
          error: "Case title, case number, and date filed are required",
        });
      }

      // Check if case number already exists
      const existingCase = await db
        .collection("courtCases")
        .where("caseNumber", "==", caseNumber)
        .get();

      if (!existingCase.empty) {
        return res.status(400).json({ error: "Case number already exists" });
      }

      let pdfFileUrl = null;
      let pdfFileName = null;

      // Upload file if provided
      if (fileBuffer && fileName) {
        const fileExtension = fileName.split(".").pop();
        const uniqueFileName = `court-cases/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        
        const file = bucket.file(uniqueFileName);
        await file.save(fileBuffer, {
          metadata: {
            contentType: mimeType!,
          },
        });

        // Make file publicly accessible
        await file.makePublic();
        pdfFileUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;
        pdfFileName = fileName;
      }

      const courtCaseData: Omit<CourtCase, "id"> = {
        caseTitle,
        caseNumber,
        description: description || "",
        dateFiled,
        status,
        courtName: courtName || "",
        judgeName: judgeName || "",
        plaintiff: plaintiff || "",
        defendant: defendant || "",
        caseType: caseType || "",
        priority,
        pdfFileUrl,
        pdfFileName,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      };

      const docRef = await db.collection("courtCases").add(courtCaseData);

      res.status(201).json({
        message: "Court case created successfully",
        id: docRef.id,
      });
    } catch (error) {
      console.error("Error creating court case:", error);
      res.status(500).json({ error: "Failed to create court case" });
    }
  });

  busboy.end(req.body);
});

// PUT update court case
router.put("/:id", authenticateToken, requireAdmin, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const busboy = Busboy({ headers: req.headers });
  const fields: any = {};
  let fileBuffer: Buffer | null = null;
  let fileName: string | null = null;
  let mimeType: string | null = null;

  busboy.on("field", (fieldname, val) => {
    fields[fieldname] = val;
  });

  busboy.on("file", (fieldname, file, info) => {
    if (fieldname === "pdfFile") {
      fileName = info.filename;
      mimeType = info.mimeType;
      
      if (mimeType !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF files are allowed" });
      }

      const chunks: Buffer[] = [];
      file.on("data", (chunk) => chunks.push(chunk));
      file.on("end", () => {
        fileBuffer = Buffer.concat(chunks);
      });
    }
  });

  busboy.on("finish", async () => {
    try {
      const docRef = db.collection("courtCases").doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Court case not found" });
      }

      const existingData = doc.data() as CourtCase;
      let pdfFileUrl = existingData.pdfFileUrl;
      let pdfFileName = existingData.pdfFileName;

      // Upload new file if provided
      if (fileBuffer && fileName) {
        // Delete old file if exists
        if (existingData.pdfFileUrl) {
          try {
            const oldFileName = existingData.pdfFileUrl.split("/").pop();
            if (oldFileName) {
              await bucket.file(`court-cases/${oldFileName}`).delete();
            }
          } catch (error) {
            console.log("Old file not found or already deleted");
          }
        }

        const fileExtension = fileName.split(".").pop();
        const uniqueFileName = `court-cases/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        
        const file = bucket.file(uniqueFileName);
        await file.save(fileBuffer, {
          metadata: {
            contentType: mimeType!,
          },
        });

        await file.makePublic();
        pdfFileUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;
        pdfFileName = fileName;
      }

      const updateData = {
        ...fields,
        pdfFileUrl,
        pdfFileName,
        updatedAt: admin.firestore.Timestamp.now(),
      };

      await docRef.update(updateData);

      res.json({ message: "Court case updated successfully" });
    } catch (error) {
      console.error("Error updating court case:", error);
      res.status(500).json({ error: "Failed to update court case" });
    }
  });

  busboy.end(req.body);
});

// DELETE court case
router.delete("/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("courtCases").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Court case not found" });
    }

    const data = doc.data() as CourtCase;

    // Delete associated file if exists
    if (data.pdfFileUrl) {
      try {
        const fileName = data.pdfFileUrl.split("/").pop();
        if (fileName) {
          await bucket.file(`court-cases/${fileName}`).delete();
        }
      } catch (error) {
        console.log("File not found or already deleted");
      }
    }

    await docRef.delete();

    res.json({ message: "Court case deleted successfully" });
  } catch (error) {
    console.error("Error deleting court case:", error);
    res.status(500).json({ error: "Failed to delete court case" });
  }
});

export { router as courtCasesRouter };