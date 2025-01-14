const Util = {
  randomVec(length) {
    const deg = 2 * Math.PI * Math.random();
    return Util.scale( [Math.sin(deg), Math.cos(deg)], length )
  },

  scale(vec, m) {
    return [vec[0] * m, vec[1] * m];
  },

  dist(pos1, pos2) {
    //sqrt((x2 - x1)^2 + (y2-y1)^2)
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  }
}

export default Util;