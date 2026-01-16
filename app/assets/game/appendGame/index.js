import allbet from './allbet';
import ag from './ag';
import dg from './dg';
import sexybcrt from './sexybcrt';
import evolive from './evolive';
import db_live from './db_live';
import via from './via';
import meta from './meta';
import astar from './astar';

const gameMapping = {
  allbet,
  ag,
  dg,
  sexybcrt,
  evolive,
  db_live,
  via,
  meta,
  astar,
};

export default function () {
  return gameMapping;
}
