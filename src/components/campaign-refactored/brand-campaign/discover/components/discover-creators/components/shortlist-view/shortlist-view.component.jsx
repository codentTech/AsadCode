import ViewHeader from "../view-header/view-header.component";
import CreatorGrid from "../creator-grid/creator-grid.component";
import NotFound from "@/common/components/not-found/not-found.component";

const ShortlistView = ({
  selectedShortlist,
  getSortedCreators,
  onBackClick,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
}) => {
  const sortedCreators = getSortedCreators();

  return (
    <div className="space-y-4">
      <ViewHeader
        title={selectedShortlist.name}
        count={sortedCreators.length}
        showBackButton={true}
        onBackClick={onBackClick}
      />
      {sortedCreators.length === 0 ? (
        <NotFound
          title="No Creators Found"
          description="No creators found. Try adjusting your search or filters."
        />
      ) : (
        <CreatorGrid
          creators={sortedCreators}
          isShortlist={true}
          onCreatorPreview={onCreatorPreview}
          onSaveToShortlist={onSaveToShortlist}
          onRemoveFromShortlist={onRemoveFromShortlist}
          onInviteClick={onInviteClick}
        />
      )}
    </div>
  );
};

export default ShortlistView;
