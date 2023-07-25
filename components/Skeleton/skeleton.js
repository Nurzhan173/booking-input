export class Skeleton {
  render() {
    const skeleton = document.createElement('div');
    const skeletonItemWrapper = document.createElement('div');
    const skeletonItem = document.createElement('div');
    const skeletonHeader = document.createElement('div');
    const skeletonTitle = document.createElement('div');

    const itemFragment = document.createDocumentFragment();
    const cardFragment = document.createDocumentFragment();

    skeleton.className = 'skeleton';
    skeletonItemWrapper.className = 'skeleton-item-wrapper';
    skeletonItem.className = 'skeleton-item';
    skeletonHeader.className = 'skeleton-header';
    skeletonTitle.className = 'skeleton-title';

    itemFragment.append(skeletonHeader);
    itemFragment.append(skeletonTitle);

    skeletonItem.appendChild(itemFragment)

    for(let i = 0; i < 4; i++){
      cardFragment.append(skeletonItem);
    }

    skeletonItemWrapper.appendChild(cardFragment);

    skeleton.appendChild(skeletonItemWrapper);

    return skeleton;
  }
}
