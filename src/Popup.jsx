import { useRef, useEffect } from "react";

/**
 * @param props onClickOutside, show, className
 */
export default function Pupup(props) {
  const ref = useRef(null);

  function handleClick(event) {
    if (ref.current && !ref.current.parentNode.contains(event.target)) {
      props.onClickOutside();
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return (
    props.show && (
      <div ref={ref} className={props.className}>
        {props.children}
      </div>
    )
  );
}
