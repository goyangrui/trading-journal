const createTrade = (req, res) => {
  res.send("create trade");
};

const getAllTrades = (req, res) => {
  res.send("get all trades");
};

const updateTrade = (req, res) => {
  res.send("update trade");
};

const deleteTrade = (req, res) => {
  res.send("delete trade");
};

export { createTrade, getAllTrades, updateTrade, deleteTrade };
