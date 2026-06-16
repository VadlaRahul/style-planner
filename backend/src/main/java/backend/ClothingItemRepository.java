package backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClothingItemRepository
    extends JpaRepository<ClothingItem, Long> {

    List<ClothingItem> findByUserId(Long userId);

    List<ClothingItem> findByUserIdAndCategory(
        Long userId, String category);
}