/*
 * @Author: Kanata You 
 * @Date: 2021-11-16 19:03:01 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 19:03:52
 */

export const sortedStrings = (data: string[]): string[] => {
  return data.sort((a, b) => {
    for (let i = 0; i < a.length && i < b.length; i += 1) {
      const ca = a.charCodeAt(i);
      const cb = b.charCodeAt(i);
      if (ca !== cb) {
        return ca - cb;
      }
    }

    return a.length - b.length;
  });
};
