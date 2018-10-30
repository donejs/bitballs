import steal from "@steal";

// The slim loader doesn't include a isEnv, so that means it's prod.
export default !(!steal.isEnv || steal.isEnv("production"));
