import prisma from "../util/prisma.js";

export const createTask = async (req, res) => {
  try {
    const { name, description } = req.body;

    const lastTask = await prisma.task.findFirst({
      orderBy: { order: "desc" },
    });

    const task = await prisma.task.create({
      data: { name, description, order: lastTask ? lastTask.order + 1 : 1 },
    });
    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { order: "asc" },
    });
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { name, description } = req.body;
    await prisma.task.update({ where: { id }, data: { name, description } });
    res.json({ message: "Task updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { tasks } = req.body;

    for (const task of tasks) {
      await prisma.task.update({
        where: { id: task.id },
        data: { order: task.order },
      });
    }

    res.json({ message: "Tasks updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
