/** Type declarations for CSS modules */
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

/** Type declarations for plain CSS files */
declare module '*.css' {
  const content: string
  export default content
}