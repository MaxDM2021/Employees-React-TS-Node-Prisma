const { prisma } = require("../prisma/prisma-client");

/**
 *
 * @rout GET /api/employees
 * @desc получение всех сотрудников
 * @accsess Private
 */

const all = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();

    res.status(200).json(employees);
  } catch {
    res.status(500).json({ message: "Failed to get employee" });
  }
};

/**
 *
 * @rout POST /api/employees/add
 * @desc Добавление сотрудника
 * @accsess Private
 */

const add = async (req, res) => {
  try {
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });
    return res.status(201).json(employee);
  } catch (err){
    console.log(err);
    return res.status(500).json({ message: "Something went wrong11" });
  }
};

// =========REMOVE=========

/**
 *
 * @rout POST /api/employees/remove/:id
 * @desc Удаление сотрудника
 * @accsess Private
 */

const remove = async (req, res) => {
  const { id } = req.body;

  try {
    await prisma.employee.delete({
      where: {
        id,
      },
    });
    res.status(204).json("OK");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete employee" });
  }
};

// =========EDIT=========

/**
 *
 * @rout PUT /api/employees/edit/:id
 * @desc Редактирование сотрудника
 * @accsess Private
 */

const edit = async (req, res) => {
  const data = req.body;
  const id = data.id;

  try {
    await prisma.employee.update({
      where: {
        id,
      },
      data,
    });
    res.status(204).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to edit employee" });
  }
};

// =========GET EMPLOYEE=========

/**
 *
 * @rout GET /api/employees/:id
 * @desc получение сотрудника
 * @accsess Private
 */

const employee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json(employee);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get employee" });
  }
};

module.exports = {
  all,
  add,
  remove,
  edit,
  employee,
};
