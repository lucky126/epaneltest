let MaxFixSeq = 0

export const setMaxFixSeq = fixSeq => {
  MaxFixSeq = fixSeq
}

export const getNextFixSeq = () => {
  MaxFixSeq++
  return MaxFixSeq
}

export const getMaxFixSeq = () => {
  return MaxFixSeq
}
