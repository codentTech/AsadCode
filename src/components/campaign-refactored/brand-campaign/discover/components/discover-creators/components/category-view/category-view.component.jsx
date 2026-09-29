import ViewHeader from "../view-header/view-header.component";
import CreatorGrid from "../creator-grid/creator-grid.component";
import NotFound from "@/common/components/not-found/not-found.component";

const CategoryView = ({
  selectedCategory,
  filteredCreators,
  onBackClick,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
  onEndReached,
  onRangeChanged,
  scrollParent,
}) => {
  return (
    <div className="space-y-4">
      <ViewHeader
        title={selectedCategory.name}
        count={filteredCreators.length}
        showBackButton={true}
        onBackClick={onBackClick}
      />
      {filteredCreators.length === 0 ? (
        <NotFound
          title="No Creators Found"
          description="No creators found. Try adjusting your search or filters."
        />
      ) : (
        <CreatorGrid
          creators={filteredCreators}
          onCreatorPreview={onCreatorPreview}
          onSaveToShortlist={onSaveToShortlist}
          onRemoveFromShortlist={onRemoveFromShortlist}
          onInviteClick={onInviteClick}
          onEndReached={onEndReached}
          onRangeChanged={onRangeChanged}
          scrollParent={scrollParent}
        />
      )}
    </div>
  );
};

export default CategoryView;
