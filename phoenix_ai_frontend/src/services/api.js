export const getStatus = async () => {
  const res = await fetch(process.env.REACT_APP_API_URL + '/status');
  return res.json();
};
