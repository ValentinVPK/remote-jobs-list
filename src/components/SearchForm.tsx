type SearchFormProps = {
  searchText: string;
  onSearchTextChange: (searchText: string) => void;
};

export default function SearchForm({
  searchText,
  onSearchTextChange,
}: SearchFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      action="#"
      className="search"
    >
      <button type="submit"></button>

      <input
        value={searchText}
        onChange={(e) => {
          onSearchTextChange(e.target.value);
        }}
        spellCheck="false"
        type="text"
        required
        placeholder="Find remote developer jobs..."
      />
    </form>
  );
}
