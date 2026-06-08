export const forwardRef = <T, P>(render: (props: P, ref: unknown) => unknown) =>
  ({
    $$typeof: Symbol.for('react.forward_ref'),
    render,
  }) as unknown as (props: P & { ref?: T }) => unknown
