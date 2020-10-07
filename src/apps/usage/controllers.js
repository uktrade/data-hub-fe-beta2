module.exports = function renderUsage(req, res, next) {
    res.title('Data Hub usage').render('usage/views/usage', {})
}
