// Temporary ambient module declarations to satisfy the typechecker during refactor
// These are minimal and should be replaced by proper types or @types packages later.

declare module 'react-native/Libraries/Image/AssetSourceResolver' {
  const x: any;
  export default x;
}

declare module '@react-native/assets-registry/registry' {
  export function getAssetByID(id: any): any;
  export type PackagerAsset = any;
}

declare module 'invariant' {
  const invariant: any;
  export default invariant;
}

// Local alias used in the project; provide a minimal shape so tsc can continue.
declare module '@/lib/validation/auth' {
  export type LoginFormValues = any;
}
