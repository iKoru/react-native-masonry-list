import { Image } from "react-native";
import Task from "./task";
import { setItemSource } from "../utils";

const defaultRatio = [1, 1.25, 0.5625];
export const resolveImage = (uri, image, data, itemSource, defaultImageDimensions) => {
  if (data && itemSource && itemSource.length > 0) {
    return new Task((reject, resolve) => {
      Image.getSize(
        uri,
        (width, height) => {
          const diff = defaultRatio.map(r => Math.abs(r - height / width));
          const min = Math.min(...diff);
          image.dimensions = { width, height: defaultRatio[diff.findIndex(d => d === min)] };
          const resolvedData = setItemSource(data, itemSource, image);
          resolve({
            ...resolvedData,
          });
        },
        () => {
          image.dimensions = defaultImageDimensions || { width: 30, height: 30 };
          const resolvedData = setItemSource(data, itemSource, image);
          resolve({
            ...resolvedData,
          });
        }
      );
    });
  }

  return new Task((reject, resolve) =>
    Image.getSize(
      uri,
      (width, height) => {
        const diff = defaultRatio.map(r => Math.abs(r - height / width));
        const min = Math.min(...diff);
        return resolve({
          ...image,
          dimensions: {
            width,
            height: defaultRatio[diff.findIndex(d => d === min)] * width,
          },
        });
      },
      () => {
        resolve({ ...image, dimensions: defaultImageDimensions || { width: 30, height: 30 } });
      }
    )
  );
};

export const resolveLocal = (image, data, itemSource) => {
  if (data && itemSource && itemSource.length > 0) {
    if (image.dimensions && image.dimensions.width && image.dimensions.height) {
      const resolvedData = setItemSource(data, itemSource, image);
      return new Task(
        (reject, resolve) => {
          resolve({
            ...resolvedData,
          });
          // eslint-disable-next-line no-undef
        },
        () => {
          reject(err);
        }
      );
    }
    if (image.width && image.height) {
      return new Task(
        (reject, resolve) => {
          image.dimensions = { width: image.width, height: image.height };
          const resolvedData = setItemSource(data, itemSource, image);
          resolve({
            ...resolvedData,
          });
          // eslint-disable-next-line no-undef
        },
        err => reject(err)
      );
    }
    return new Task(
      (reject, resolve) => {
        image.dimensions = { width: 0, height: 30 };
        const resolvedData = setItemSource(data, itemSource, image);
        resolve({
          ...resolvedData,
        });
        // eslint-disable-next-line no-undef
      },
      err => reject(err)
    );
  }
  if (image.dimensions && image.dimensions.width && image.dimensions.height) {
    return new Task(
      (reject, resolve) => {
        resolve({
          ...image,
        });
        // eslint-disable-next-line no-undef
      },
      err => reject(err)
    );
  }
  if (image.width && image.height) {
    return new Task(
      (reject, resolve) => {
        resolve({
          ...image,
          dimensions: {
            width: image.width,
            height: image.height,
          },
        });
        // eslint-disable-next-line no-undef
      },
      err => reject(err)
    );
  }
  return new Task(
    (reject, resolve) => {
      resolve({ ...image, dimensions: { width: 0, height: 30 } });
      // eslint-disable-next-line no-undef
    },
    err => reject(err)
  );
};
