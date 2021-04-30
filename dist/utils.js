export function isPlacementTag(tag) {
  if (tag.name === '#PlacementDaemon' || tag.name === '#PlacementDeamon' || tag.name === '#PlacemntDaemon') {
    return true;
  }
  return false;
}

export function isLNFTag(tag) {
  if (tag.name === '#LostAndFound') {
    return true;
  }
  return false;
}

export function isCovidTag(tag) {
  if (tag.name === '#CoviDaemon' || tag.name === '#covidaemon') {
    return true;
  }
  return false;
}