import ViewHeader from "../headers/view-header.component";
import CreatorGrid from "../grid/creator-grid.component";
import NotFound from "@/common/components/not-found/not-found.component";

const CategoryView = ({
  selectedCategory,
  filteredCreators,
  onBackClick,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
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
        />
      )}
    </div>
  );
};

export default CategoryView;
