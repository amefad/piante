import Header from "./Header";
import "./Page.scss";

export default function Page(props) {
  return (
    <div id="page">
      <Header />
      <main className={props.className}>
        {props.title && <h2>{props.title}</h2>}
        {props.children}
      </main>
    </div>
  );
}
