import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import type { DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface ApiResponse {
  data: Artwork[];
  pagination: {
    total: number;
    total_pages: number;
    current_page: number;
  };
}

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(12);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [manuallyDeselectedIds, setManuallyDeselectedIds] = useState<Set<number>>(new Set());

  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");

  const fetchArtworks = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`
      );
      const data: ApiResponse = await response.json();
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const page = first / rows + 1;
    fetchArtworks(page, rows);
  }, [first, rows]);

  // Compute selected rows for current page
  const selectedRows = artworks.filter((art, index) => {
    const globalIndex = first + index + 1;

    if (
      selectedCount > 0 &&
      globalIndex <= selectedCount &&
      !manuallyDeselectedIds.has(art.id)
    ) {
      return true;
    }

    return selectedIds.has(art.id);
  });

  // Manual checkbox selection
  const onSelectionChange = (e: any) => {
    const pageSelected: Artwork[] = e.value;

    const newSelectedIds = new Set(selectedIds);
    const newDeselectedIds = new Set(manuallyDeselectedIds);

    artworks.forEach((art, index) => {
      const globalIndex = first + index + 1;
      const isInGlobalRange = selectedCount > 0 && globalIndex <= selectedCount;
      const isNowSelected = pageSelected.some((a) => a.id === art.id);

      if (isInGlobalRange) {
        if (!isNowSelected) {
          newDeselectedIds.add(art.id);
        } else {
          newDeselectedIds.delete(art.id);
        }
      } else {
        if (isNowSelected) {
          newSelectedIds.add(art.id);
        } else {
          newSelectedIds.delete(art.id);
        }
      }
    });

    setSelectedIds(newSelectedIds);
    setManuallyDeselectedIds(newDeselectedIds);
  };

  // Handle custom select input
  const handleCustomSelect = () => {
    const count = parseInt(inputValue);

    if (!count || count <= 0) {
      setSelectedCount(0);
      setSelectedIds(new Set());
      setManuallyDeselectedIds(new Set());
      return;
    }

    setSelectedCount(count);
    setSelectedIds(new Set());
    setManuallyDeselectedIds(new Set());
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Artworks</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="number"
          placeholder="Select first N rows"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleCustomSelect} style={{ backgroundColor:"white", marginLeft: "10px" }}>
          Apply
        </button>
      </div>

      <DataTable
        value={artworks}
        lazy
        paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPage={(e: DataTablePageEvent) => {
          setFirst(e.first);
          setRows(e.rows);
        }}
        loading={loading}
        dataKey="id"
        selectionMode="multiple"
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place Of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
    </div>
  );
}

export default App;