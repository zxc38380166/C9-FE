import childGame from '../childGame';

const hotGame = () => {
  const result = Object.entries(childGame).reduce((value, [key, item]) => {
    value[key] = item.slice(0, 2);
    return value;
  }, {});

  return result;
};

export default hotGame();
