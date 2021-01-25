type Cvalue = string | number;
// 获取所有的叶子节点
interface WC {
  children?: Array<WC>;
  value?: Cvalue;
  label?: string;
}

export function isEqualArrays(arrA: any[], arrB: any[]): boolean {
  if (arrA === arrB) {
    return true;
  }

  if (!arrA || !arrB) {
    return false;
  }

  const len = arrA.length;

  if (arrB.length !== len) {
    return false;
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
}

export function getAllLeafOptions<T extends WC>(options: Array<T>) {
  const result: Array<WC> = [];
  function getLeaf<U extends WC>(options: Array<U>) {
    options.forEach(item => {
      if (item.children && item.children.length > 0) {
        getLeaf(item.children);
      } else {
        result.push(item);
      }
    });
  }
  getLeaf(options);
  return result;
}

function isContain<T extends WC>(options: Array<T>, v: Cvalue) {
  for (let i = 0; i < options.length; i++) {
    let itm = options[i];

    // 发现，也立即返回
    if (itm.value === v) {
      return true;
    }
    // 没有发现，继续遍历他的子类
    // 如果发现，孙子节点有，也立即返回；
    let children = itm.children;
    if (children && children.length > 0 && isContain(children, v)) {
      return true;
    }
  }
  return false;
}

// 根据叶子节点获取完整的链路
export function getEntityChainList<U extends WC>(options: Array<U>, v: Cvalue) {
  let reulst: Array<Cvalue> = [];

  function getTargetList<T extends WC>(options: Array<T>, v: Cvalue) {
    for (let i = 0; i < options.length; i++) {
      let itm = options[i];

      //  发现，立即返回
      if (itm.value === v) {
        reulst.push(itm.value || '');
        return;
      }
      // 发现，子类包含，也立即返回；
      let children = itm.children;
      if (children && children.length > 0 && isContain(children, v)) {
        reulst.push(itm.value || '');
        getTargetList(children, v);
        return;
      }
    }
  }
  getTargetList(options, v);
  return reulst;
}
