import Header from "./Header";

export default function Page(props) {
  return (
    <>
      <Header />
      <main className={props.className}>
        {props.title && <h2>{props.title}</h2>}
        {props.children}
      </main>
    </>
  );
}
