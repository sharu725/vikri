export const set_local_storage = (name, story_array) => {
  try {
    window.localStorage.setItem(name, JSON.stringify(story_array));
  } catch (error) {
    console.log("Unable to store locally.");
  }
};
export const set_local_storage_string = (name, word) => {
  try {
    window.localStorage.setItem(name, word);
  } catch (error) {
    console.log("Unable to store locally.");
  }
};
export const get_local_storage = (name, return_if_empty) => {
  try {
    return JSON.parse(
      window.localStorage.getItem(name) || JSON.stringify(return_if_empty)
    );
  } catch (error) {
    console.log("Unable to store locally.");
  }
};
export const get_local_storage_string = (name, return_if_empty) => {
  try {
    return window.localStorage.getItem(name) || "";
  } catch (error) {
    console.log("Unable to store locally.");
  }
};
