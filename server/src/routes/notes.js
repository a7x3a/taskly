const { Router } = require("express");
const mongoose = require("mongoose");
const Note = require("../database/schemas/Notes");
const { isStringObject } = require("util/types");
const router = Router();

router.get("", async (request, response) => {
  try {
    const userId = request.session.user._id;
    const notes = await Note.find({ userId });
    response.json(notes);
  } catch (e) {
    response.status(500).json(e);
  }
});

router.post("/add", async (request, response) => {
  try {
    const { title, content, categorie } = request.body;
    const userId = request.session.user._id;
    const note = new Note({
      title,
      content,
      categorie,
      userId,
      createdAt: new Date(),
    });
    await note.save();
    response.status(201).json(note);
  } catch (e) {
    response.status(500).json(e);
  }
});

router.delete("/delete", async (request, response) => {
  try {
    const userId = request.session.user._id;
    const _id = request.body.noteId;
    const note = await Note.findOneAndDelete({ _id, userId });
    if (!note) {
      return response.status(404).json({ message: "Note not found" });
    }
    response.status(200).json({ message: "Note deleted successfully" });
  } catch (e) {
    response.status(500).json(e);
  }
});

router.put("/update", async (request, response) => {
  try {
    const userId = request.session.user._id;
    const { _id, title, content, categorie } = request.body;
    const note = await Note.findOneAndUpdate(
      { _id, userId },
      { title, content, categorie },
    );
    if (!note) {
      return response.status(404).json({ message: "Note not found" });
    }
    response.status(200).json({ message: "Note not found" });
  } catch (e) {
    response.status(500).json(e);
  }
});

router.put("/complete", async (request, response) => {
  try {
    const { noteId } = request.body;
    const userId = request.session.user._id;
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId: userId },
      { $set: { completed: request.body.completed } },
      { new: true }
    );

    if (!note) {
      return response
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    response.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
