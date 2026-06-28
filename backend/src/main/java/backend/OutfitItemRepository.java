package backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OutfitItemRepository
    extends JpaRepository<OutfitItem, Long> {
    List<OutfitItem> findByOutfitId(Long outfitId);
}