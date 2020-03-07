const Expense = require('../models/expense')

const getExpenses = function(req, res) {
  // solo podemos hacer GET de los Expenses del usuario que hizo login
  Expense.find({ createdBy: req.user._id}).then(function(expenses) {
    res.send(expenses)
  }).catch(function(error){
    res.status(500).send(error)
  })
}

const getExpense = function(req, res) {
  // solo podemos traer el Expense si es que es del usuario que hizo login
  const _id = req.params.id
  Expense.findOne({ _id, createdBy: req.user._id }).then(function(expense) {
    if(!expense){
      return res.status(404).send({ error: `Task with id ${_id} not found.`})
    }
    return res.send(expense)
  }).catch(function(error) {
    return res.status(500).send({ error: error })
  })
}

const createExpense = function(req, res){
  // los ... son para copiar Expense el req.body
  // modificar aqui
  const expense = new Expense({
    ...req.body,
    createdBy: req.user._id
  }) 
  if(expense.Nature == false)
  {
    expense.Amount = expense.Amount * -1
  }
  expense.save().then(function() {
    return res.send(expense)
  }).catch(function(error) {
    return res.status(400).send({ error: error })
  })
}

/*
const updateExpense = function(req, res) {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  // revisa que los updates enviados sean permitidos, que no envie una key que no permitimos
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

  if( !isValidUpdate ) {
    return res.status(400).send({
      error: 'Invalid update, only allowed to update: ' + allowedUpdates
    })
  }
  // ya no solo buscamos por id, si no también deberia de ser de el owner
  // del Expense por lo tanto usamos findOneAndUpdate para pasarle mas datos
  // Expense.findByIdAndUpdate(_id, req.body ).then(function(Expense) {
  Expense.findOneAndUpdate({ _id, createdBy: req.user._id }, req.body ).then(function(Expense) {
    if (!Expense) {
      return res.status(404).send({ error: `Task with id ${_id} not found.`})
    }
    return res.send(Expense)
  }).catch(function(error) {
    res.status(500).send({ error: error })
  })
}

const deleteExpense = function(req, res) {
  const _id = req.params.id
  Expense.findOneAndDelete({ _id, createdBy: req.user._id }).then(function(Expense){
    if(!Expense) {
      return res.status(404).send({ error: `Task with id ${_id} not found.`})
    }
    return res.send(Expense)
  }).catch(function(error) {
    res.status(505).send({ error: error })
  })
}
*/
module.exports = {
  getExpenses   : getExpenses,
  getExpense   : getExpense,
  createExpense : createExpense
  //updateExpense : updateExpense
  //deleteExpense : deleteExpense
}